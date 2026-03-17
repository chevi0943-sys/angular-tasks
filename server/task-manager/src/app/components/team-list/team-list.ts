import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css'
})
export class TeamList implements OnInit {

  public teamsService = inject(TeamsService);
  private authService = inject(AuthService); // הזרקת שירות האימות

  // נניח שיש סיגנל ב-authService שנקרא currentUser
  currentUserId = computed(() => this.authService.currentUser()?.id);

  newTeamNameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  isCreateOpen = signal(false);
  //========================================================================================
  activeTeamForMember = signal<string | null>(null);
  selectedUserEmail = new FormControl('', [Validators.required]);
  // ngOnInit() {
  //   this.loadAllData();
  // }


  ngOnInit() {
    // 1. טוענים את הצוותים
    this.teamsService.loadTeams(); // וודא שזה מעדכן את myTeams signal
    this.teamsService.loadAllUsers();

    // 2. משתמשים ב-Effect כדי לזהות מתי הצוותים הגיעו ולטעון להם חברים

  }


  // team-list.ts

  loadAllData() {
    this.teamsService.loadTeams();
    this.teamsService.loadAllUsers();

  }


  fetchMembersForTeam(team: any) {
    this.teamsService.getTeamMembers(team.id).subscribe({
      next: (members) => {
        // במקום לעדכן את האובייקט ישירות, מעדכנים דרך ה-Service
        this.teamsService.updateTeamMembers(team.id, members);
      },
      error: (err) => {
        console.error('שגיאה בטעינה', err);
        this.teamsService.updateTeamMembers(team.id, []); // מונע "טעינה" נצחית בשגיאה
      }
    });
  }
  submitAddMember(teamId: any) {
    const userId = this.selectedUserEmail.value; // עכשיו זה מכיל ID
    if (!userId) return;

    this.teamsService.addMember(teamId, userId).subscribe({
      next: () => {
        alert('החבר נוסף בהצלחה! 🎉');
        this.activeTeamForMember.set(null);
        this.selectedUserEmail.reset();
        this.teamsService.loadTeams();
      },
      error: (err) => alert('שגיאה: ' + (err.error?.error || 'לא ניתן להוסיף חבר'))
    });
  }


  toggleCreate() {
    this.isCreateOpen.update(value => !value);
  }
  createNewTeam() {
    if (this.newTeamNameControl.invalid) return;
    const name = this.newTeamNameControl.value!;

    this.teamsService.addTeam(name).subscribe({
      next: () => {
        this.newTeamNameControl.reset();
        this.isCreateOpen.set(false);
      },
      error: (err) => alert('שגיאה ביצירת הצוות')
    });
  }

  // הוספת סיגנל חדש לרשימת החברים
  currentTeamMembers = signal<any[]>([]);

  // פונקציה לטעינת החברים (נקרא לה כשפותחים את ה-Toggle)
  loadMembers(teamId: any) {
    this.teamsService.getTeamMembers(teamId).subscribe({
      next: (members) => this.currentTeamMembers.set(members),
      error: () => console.error('שגיאה בטעינת חברי צוות')
    });
  }

  // נעדכן את ה-Toggle שיטען חברים כשהוא נפתח
  toggleAddMember(teamId: any) {
    const idStr = String(teamId);
    if (this.activeTeamForMember() === idStr) {
      this.activeTeamForMember.set(null);
    } else {
      this.activeTeamForMember.set(idStr);
      this.loadMembers(teamId); // טעינת החברים ברגע שפותחים את התיבה
    }
  }
  deleteTeam(id: string, event: Event) {
    event.stopPropagation(); // מונע ניווט בטעות

    if (confirm('האם את בטוחה שברצונך למחוק את הצוות? פעולה זו תמחק גם את כל הפרויקטים המשויכים אליו.')) {
      this.teamsService.deleteTeam(id).subscribe({
        next: () => {
          console.log('Team deleted successfully');
          if (this.activeTeamForMember() === String(id)) {
            this.activeTeamForMember.set(null);
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'אין הרשאות למחוק צוות זה';
          alert('שגיאה במחיקה: ' + errorMessage);
        }
      });
    }
  }

  constructor() {


    effect(() => {
      const teams = this.teamsService.myTeams();
      teams.forEach(team => {
        // טוען חברים רק לצוותים שעדיין לא ניסינו לטעון להם (members הוא undefined)
        if (team.members === undefined) {
          this.fetchMembersForTeam(team);
        }
      });
    }, { allowSignalWrites: true });


  }

  onRemoveMember(teamId: any, userId: any) {
    if (String(userId) === String(this.currentUserId())) {
      alert('עצור! 🛑 אתה לא יכול להסיר את עצמך מהצוות.');
      return;
    }

    if (!confirm('האם אתה בטוח שברצונך להסיר חבר זה?')) return;
    if (!teamId || !userId) {
      alert('חסר ID! וודא ש-team.id וגם member.id קיימים.');
      return;
    }
    this.teamsService.removeMember(String(teamId), String(userId)).subscribe({
      next: () => {
        this.teamsService.myTeams.update(teams =>
          teams.map(team => {
            if (String(team.id) === String(teamId)) {
              // התיקון כאן: הוספנו (team.members || [])
              const currentMembers = team.members || [];

              return {
                ...team,
                members: currentMembers.filter((m: any) => String(m.id) !== String(userId))
              };
            }
            return team;
          })
        );
      },
      error: (err) => alert('שגיאה בהסרת החבר')
    });
  }

}

