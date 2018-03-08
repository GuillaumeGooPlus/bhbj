import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { TeamService} from '../../team/team.service';
import { Team} from '../../team/team.model';
import { MatDialog} from '@angular/material';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Search, PaginationData} from '../../shared/shared.model';
import { GlobalEventsManager } from '../../globalEventsManager';
import { TeamDialogComponent } from '../single/dialog/teamDialog.component';
// import { ToastsManager} from 'ng2-toastr';
// import { Location} from '@angular/common';



@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['../team.component.css'],
})
export class TeamsComponent implements OnInit, OnChanges {
  @Output() getTeamsCross: EventEmitter<any> = new EventEmitter();
  @Input() search: Search = new Search();
  @Input() showBack: number = -1;
  loading = false;
  fetchedTeams: Team[] = [];

  paginationData = new PaginationData();

  // @Input() userId = '';
  // @Input() idQuote = '';
  // @Input() showHeader = true;
  // @Output() newPaiementSaved: EventEmitter<any> = new EventEmitter();
  // @Input() showCreate = true;
  // search = {
  //   orderBy : '',
  //   search: '',
  //   idQuote:'',
  //   isExpense: false
  // };

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    // private toastr: ToastsManager,
    public dialog: MatDialog,
    private router: Router,
    // private location: Location,
    private globalEventsManager: GlobalEventsManager,
  ) {}



  ngOnChanges() {
    // console.log(this.search)
    this.getTeams(this.paginationData.currentPage, this.search);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['isExpense'] === 'true') {
        this.search.isExpense = true
      } else {
        this.search.isExpense = false
      }
      this.getTeamsInit();
    })
  }


  getTeamsInit() {
    const this2 = this
    setTimeout(function(){
      // this2.search.quoteId = this2.idQuote
      this2.search.orderBy = 'name';
      this2.getTeams(1, this2.search)
    }, 200);
  }
  // searchTeams() {}


  // goBack() {
  //   this.location.back();
  // }

  searchInput() {
    this.getTeams(this.paginationData.currentPage, this.search)
  }

  orderBy(orderBy: string) {
    this.search.orderBy = orderBy
    this.getTeams(this.paginationData.currentPage, this.search)
  }

  // onDelete(id: string) {
  //   this.teamService.deleteTeam(id)
  //     .subscribe(
  //       res => {
  //         this.getTeamsInit()
  //         this.authService.successNotif(res.message);
  //         this.getTeamsCross.emit(this.fetchedTeams)
  //         // console.log(res);
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }


  getPage(page: number) {
    this.getTeams(page, this.search);
  }


  getTeams(page: number, search: any) {
    this.loading = true;
    this.teamService.getTeams(page, search)
      .subscribe(
        res => {
          this.paginationData = res.paginationData;
          this.fetchedTeams =  res.data
          this.loading = false;
          this.getTeamsCross.emit(this.fetchedTeams)
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
  }
  saved(result) {
    // this.getTeamsInit()
    // console.log('saved')
    // this.newPaiementSaved.emit()
    this.getTeams(1, this.search)
  }

  openDialogPaiement(teamId: string) {
    const this2 = this
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      data : {
        search: {
          teamId: teamId
        }
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      // console.log('ab')
      // if (result) {
      //   console.log('a')
      // console.log(this.search)
        this.getTeams(this.paginationData.currentPage, this.search)
        // this.onDelete(this.fetchedTeam._id).then(function(){
        //   this2.router.navigate(['team/list']);
        // })
      // }
    })
  }

  // isAdmin() {
  //   return this.authService.isAdmin();
  // }


}
