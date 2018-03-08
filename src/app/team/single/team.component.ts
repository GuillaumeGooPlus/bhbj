import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamService } from '../team.service';
import { PaiementService } from '../../companie/single/paiement/paiement.service';
import { AccountConnectStripe } from '../../companie/single/connectStripe/connectStripe.model';
import { Team, StripeCustomer, DataSource, PaiementsTypes } from '../team.model';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { QuoteService } from '../../quote/quote.service';
import { DeleteDialogComponent } from '../../nav/deleteDialog/deleteDialog.component';
import { User } from '../../user/user.model';
import { Quote } from '../../quote/quote.model';
import { Product } from '../../product/product.model';
import { Search } from '../../shared/shared.model';
import { MatDialog } from '@angular/material';
import {AuthService} from '../../auth/auth.service';
import { Companie } from '../../companie/companie.model';

// import { Address, AddressTypes } from '../../shared/address/address.model';
// import { Location } from '@angular/common';
// import {ProductService} from '../../product/product.service';
// import { ProjectService} from '../../project/project.service';
// import { Project } from '../../project/project.model';





@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['../team.component.css'],
})
export class TeamComponent implements OnInit {
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() fetchedQuotes: Quote[] = [];
  @Input() search: Search = new Search();
  @Input() isDialog = false;
  showPaiements = false;
  fetchedTeam: Team = new Team();
  fetchedProducts: Product[] = [];
  stripeCust: StripeCustomer = new StripeCustomer();
  accountConnectStripe: AccountConnectStripe = new AccountConnectStripe();
  newCard: DataSource = new DataSource();
  myForm: FormGroup;
  autocompleteProduct = '';
  step = -1;
  paiementsTypes = PaiementsTypes;
  // fetchedUserCross: UserCross = new UserCross();
  // arrayContentToSearch = []
  // fetchedUsers: User[] = [];
  // autocompleteUser = '';
  // autocompleteProject = '';
  // fetchedProjects: Project[] = []
  // currentUser: User = new User()
  // imgLogoUrl = './assets/images/profile-placeholder.jpg'
  // imgSignatureBase64Temp = ''
  // showReLoginInApp = false;
  // userAdmins : User[] = []
  // userManagers : User[] = []
  // userClients : User[] = []
  // usersSalesRep : User[] = []
  // userStylists : User[] = []

  constructor(
    private teamService: TeamService,
    private paiementService: PaiementService,
    private quoteService: QuoteService,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private router: Router,
    private _fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    // private activatedRoute: ActivatedRoute,
    // private projectService: ProjectService,
    // private productService: ProductService,
    //    private modalService: NgbModal,
    // private location: Location,
  ) { }


  setStep(index: number) {
    this.step = index;
  }

  getUserInfosConnectStripe() {
    this.fetchedTeam.ownerCompanies.forEach(companieId => {
      //  console.log(companieId.toString())
      this.paiementService.getUserInfosConnectByCompanieId(companieId.toString())
        .subscribe(res => {
          //  this.paiementsTypes.push({label: 'Stripe', value: 'stripe' })
          this.accountConnectStripe = res.customer
          // this.paiementsTypes = PaiementsTypes
          // console.log(PaiementsTypes)
          // this.paiementsTypes.push({ label: 'Card', value: 'stripe' })
        }, error => { console.log(error) })
    })
  }

  closeDialog() {
    this.save()
    this.close.emit()
  }
  ngOnInit() {

    this.authService.getCurrentUser().ownerCompanies.forEach((companie: Companie) => {
      this.fetchedTeam.currency = companie.option.currency;
    })
    setTimeout(() => { this.step = 0 });
    this.myForm = this._fb.group({
      amount: [''],
      title: [''],
      isPaid: [false],
      type: [''],
      datePaiement: [null, []],
    })

    // this.fetchedTeam
    // .datePaiementString =
    // this.authService
    // .isoDateToHtmlDate(this.fetchedTeam.datePaiement)

    // this.fetchedTeam.isExpense = this.search.isExpense
    // this.activatedRoute.params.subscribe((params: Params) => {
    // //   if(params['isExpense']) {this.fetchedTeam.isExpense = true}
    // //   if(params['isGooplusPaiement']) {this.fetchedTeam.isGooplusPaiement = true}
    //   if(params['idTeam']) {
    //     this.getTeam(params['idTeam'])
    //   }
    // //   if(params['idQuote']) {this.getQuote(params['idQuote'])}
    // })


    if (this.search.teamId) {
      this.getTeam(this.search.teamId)
    }
  }
  // ngOnChanges() {
  //   console.log(this.search)
  // }

  // autocompleteAfterNgChanges(result) {
  //   this.fetchedTeam.quotes.forEach((quote: Quote) => {
  //     this.fetchedTeam.amount = Math.round(quote.priceQuote.priceGlobalWithDiscount)
  //   })
  // }
  // getPdf() {
  //   alert('soon')
  // }
  clearAutocompleteClient() {
    this.fetchedTeam.quotes = []
  }
  selectQuote(quote: Quote) {

    // console.log(quote.priceQuote.priceGlobalWithDiscount)
    this.fetchedTeam.quotes = [quote]
    this.search.quoteId = quote._id

  }
  // selectProject(project: Project) {
  //   this.fetchedTeam.projects = [project]
  // }
  selectUserDebited(user: User) {
    this.fetchedTeam.userDebiteds = [user]
    this.search.userId = user._id
    // this.getUserCross(user._id)
  }
  //
  // getUserCross(id: string) {
  //   this.userService.getUserCross(id)
  //     .subscribe(
  //       res => {
  //
  //         this.fetchedUserCross = res
  //         this.fetchedUserCross.profile.address.forEach(singleAddress => {
  //           this.newCard.address_city = singleAddress.city
  //           this.newCard.address_line1 = singleAddress.address
  //           this.newCard.address_line2 = singleAddress.address2
  //           this.newCard.address_country = singleAddress.country
  //           this.newCard.address_zip = singleAddress.zip
  //           this.newCard.address_state = singleAddress.state
  //         })
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     )
  // }
  autocompleteAfterNgChangesUser(user: User) {

    // this.getUserCross(user._id)
    // this.selectUserDebited(user)
  }

  autocompleteAfterNgChanges(quote: Quote) {

    if (!this.fetchedTeam._id) {
      this.fetchedTeam.amount = Math.round(quote.priceQuote.outstandingBalance)
    }
    // console.log(this.fetchedTeam.quotes)
  }
  // downloadPDF() {
  //   this.teamService.downloadPDF(this.fetchedTeam._id)
  //     .subscribe(
  //       res => {
  //         console.log(res)
  //          window.open( '/uploads/pdf/' + res );
  //       },
  //       error => { console.log(error) }
  //     )
  // }

  getQuote(idQuote: string) {
    this.quoteService.getQuote(idQuote)
      .subscribe(
      res => {
        this.fetchedTeam.quotes = [res]
      },
      error => { console.log(error) }
      )
  }

  save() {
    if (!this.fetchedTeam.userDebiteds.length) {
      this.toastr.error('Error!', 'User is mandatory')
      return;
    }
    let this2 = this
    return new Promise(function(resolve, reject) {
      // this2.fetchedTeam
      // .datePaiement = this2.authService
      // .HTMLDatetoIsoDate(this2.fetchedTeam.datePaiementString)

      if (this2.fetchedTeam._id) {
        this2.teamService.updateTeam(this2.fetchedTeam)
          .subscribe(
          res => {
            this2.authService.successNotif(res.message)
            // this2.saved.emit()
            this2.getTeam(res.obj._id)
            resolve(true)
            //this.router.navigate(['team/edit/' + this.fetchedTeam._id])
          },
          error => {
            reject(true)
            this2.toastr.error('error!', error)
          }
          )
      } else {
        this2.teamService.saveTeam(this2.fetchedTeam)
          .subscribe(
          res => {
            this2.authService.successNotif(res.message)
            // this2.saved.emit()
            this2.getTeam(res.obj._id)
            // if(this.showHeader)
            //   this.router.navigate(['team/edit/' + res.obj._id])
          },
          error => { console.log(error) }
          )
      }

    })
  }





  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.teamService.deleteTeam(id)
        .subscribe(
        res => {
          this2.authService.successNotif(res.message);
          resolve(res)
        },
        error => {
          console.log(error);
          reject(error)
        }
        )
    })
  }


  openDialogDelete() {
    const this2 = this
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent)
    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete(this.fetchedTeam._id).then(function() {
          this2.close.emit()
          // this2.save()
          // this2.router.navigate(['team/list']);
        })
      }
    })
  }




  getTeam(id: string) {
    this.teamService.getTeam(id, {})
      .subscribe(
      res => {
        this.fetchedTeam = res
        this.getUserInfosConnectStripe()
        // if(this.fetchedTeam.type === 'stripe')
        //   this.getStripeCust()
        // this.fetchedTeam
        // .datePaiementString = this.authService
        // .isoDateToHtmlDate(this.fetchedTeam.datePaiement)
      },
      error => {
        console.log(error);
      }
      )
  }
  // isAdmin() {
  //   return this.authService.isAdmin();
  // }


  //
  // getStripeCust() {
  //   // this.paiementService.getStripeCust(this.fetchedTeam._id)
  //   //   .subscribe(
  //   //     res => {
  //   //       // console.log(res)
  //   //
  //   //       this.stripeCust = res.customer
  //   //
  //   //
  //   //     },
  //   //     error => {
  //   //       this.stripeCust = new StripeCustomer()
  //   //       console.log(error)
  //   //     }
  //   //   )
  // }

  // payInStripe() {
  //     // // this.save().then(() => {
  //     //
  //     //   let dataPayInStripe = {
  //     //     amount: this.fetchedTeam.amount
  //     //   }
  //     //   console.log(dataPayInStripe)
  //     //   this.paiementService.payInStripe(this.fetchedTeam._id, dataPayInStripe)
  //     //     .subscribe(
  //     //       res => {
  //     //         // this.userService.cleanCurrentUserInSession()
  //     //         this.toastr.success('Great!')
  //     //         // this.getStripeCust()
  //     //         this.getTeam(this.fetchedTeam._id)
  //     //         // console.log(res);
  //     //       },
  //     //       error => { console.log(error); }
  //     //     );
  //     // // })
  //     // // .catch(err => {
  //     // //   console.log(err)
  //     // // })
  // }

  // deleteCustInStripe() {
  //   // this.paiementService.deleteCustInStripe(this.fetchedTeam._id)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       this.toastr.success('Great!')
  //   //       this.getStripeCust()
  //   //     },
  //   //     error => { console.log(error); }
  //   //   );
  // }
  nextStep() {
    this.step++
    this.save()
  }
  payByCardConnect() {
    this.save().then(() => {
      this.paiementService.payByCardConnect(this.fetchedTeam._id, this.newCard)
        .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!')
          // console.log(res)
          this.save()
          // this.getStripeCust()
        },
        error => {
          //   this.toastr.error(error)
          // console.log(error);
        }
        );
    })
  }
  // saveCustInStripe() {
  //   // this.paiementService.saveCustInStripe(this.fetchedTeam)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       this.toastr.success('Great!')
  //   //       this.stripeCust = res.customer
  //   //       console.log(res);
  //   //     },
  //   //     error => { console.log(error); }
  //   //   );
  // }
  //
  // saveCardInStripe() {
  //   // console.log(this.newCard)
  //   // this.paiementService.saveCardInStripe(this.newCard, this.fetchedTeam._id)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       this.toastr.success('Great!')
  //   //       this.getStripeCust()
  //   //       // console.log(res);
  //   //     },
  //   //     error => { console.log(error); }
  //   //   );
  // }
  // saveSubscriptionInStripe(planValue) {
  //   // let plan = {
  //   //   plan: planValue
  //   // }
  //   // this.paiementService.saveSubscriptionInStripe(plan, this.fetchedTeam._id)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       this.toastr.success('Great!')
  //   //       this.getStripeCust()
  //   //       this.showReLoginInApp = true
  //   //
  //   //
  //   //       // this.getStripeCust()
  //   //       // this.authService.refreshCookiesOfCurrentUser()
  //   //       // location.reload();
  //   //       // console.log(res);
  //   //     },
  //   //     error => { console.log(error); }
  //   //   );
  // }

  //
  // deleteSubInStripe(subId){
  //   // this.paiementService.deleteSub(subId)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       // console.log(res.message)
  //   //       this.toastr.success('Great!');
  //   //       this.getStripeCust()
  //   //       // this.getStripeCust()
  //   //       // location.reload();
  //   //     },
  //   //     error => {
  //   //       console.log(error);
  //   //     }
  //   //   );
  // }

  // deleteCardInStripe(cardId){
  //   // this.paiementService.deleteCard(cardId, this.fetchedTeam._id)
  //   //   .subscribe(
  //   //     res => {
  //   //       // this.userService.cleanCurrentUserInSession()
  //   //       this.toastr.success('Great!');
  //   //       this.getStripeCust()
  //   //     },
  //   //     error => {
  //   //       console.log(error);
  //   //     }
  //   //   );
  // }




}
