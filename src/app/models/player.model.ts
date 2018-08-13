export class PlayerModel {
  constructor(
    public name: string,
    public position: string,
    public team: string,
    public overallRank: number,
    public positionRank: number
  ) { }
}
