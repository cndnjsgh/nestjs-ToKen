export class Payload{
    pk:number;

    constructor(_pk:number){
        this.pk = _pk;
    }
    toString(){
        return JSON.stringify(this);
    }
}