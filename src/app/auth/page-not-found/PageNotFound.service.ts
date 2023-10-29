import { BehaviorSubject } from "rxjs";

export class PageNotFoundService{
    PageNotFound: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}