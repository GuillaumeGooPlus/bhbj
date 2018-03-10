import { Companie } from '../companie/companie.model';
import { Tour } from '../tour/tour.model';


export class UserEntry {
  _id = '';
  ownerCompanies: Companie[] = []
  tours: Tour[] = []
  nameUserEntry = '';
  dateUserEntry = new Date();
}
