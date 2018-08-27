export class PlayerModel {
  constructor(
    public name: string,
    public pos: string,
    public rank: number,
    public rankPos: number,
    public team: string,
    public owner: string,
    public _id?: number
  ) { }
}