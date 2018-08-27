import { Component, OnInit } from '@angular/core';
import { PlayerModel } from '../../models/player.model';
import { TeamOwnerModel } from '../../models/team-owner.model';
import { TeamPositionsModel } from '../../models/team-positions.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  teams: any[] = [];
  currPlayer: PlayerModel = null;
  currTeamOwner: TeamOwnerModel = null;
  showSpinner: boolean = false;

  pickCounter: number = 0;
  roundCounter: number = 1;

  positions = [
    'QB', 
    'RB', 'RB',
    'WR', 'WR',
    'TE',
    'FLEX',
    'K',
    'D/ST'
  ]

  bench = [
    'Bench', 'Bench',
    'Bench', 'Bench', 'Bench'
  ]

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.addPlayerNotif
      .subscribe(player => {
        this.currPlayer = player.player;
        this.currTeamOwner = player.team;

        this.showSpinner = true;
        this.teams = []
        this.getTeams();
        setTimeout(() => this.showSpinner = false, 2500)

        if (this.pickCounter % 12 == 0) {
          this.roundCounter++;
        }
        this.pickCounter++;
      })

  }


  getTeams() {
    this.dataService.getTeams()
      .subscribe(teams => {
        teams.forEach(team => {
          this.getPlayers(team);
        })
      })
  }

  getPlayers(team) {
    this.dataService.getPlayers('-owned', `/${team.owner}`)
      .subscribe(players => {
        let teamInfo = {
          teamOwner: team,
          players: this.fillPositions(players)
        }

        this.teams.push(teamInfo)
        this.teams.sort((a, b) => a.teamOwner.pick - b.teamOwner.pick);
      })
  }

  fillPositions(players) {
    let positions: TeamPositionsModel = {
      qb: null,
      rb1: null, rb2: null,
      wr1: null, wr2: null,
      te: null,
      flex: null,
      k: null,
      dst: null,
      b1: null, b2: null,
      b3: null, b4: null,
      b5: null,
    };

    let rbCounter = 0
    let wrCounter = 0

    players.forEach(player => {
      if (player.pos == 'QB' && positions.qb == null) {
        positions.qb = player
      } else if (player.pos == 'RB' && rbCounter == 0) {
        positions.rb1 = player
        rbCounter++;
      } else if (player.pos == 'RB' && rbCounter == 1) {
        positions.rb2 = player
        rbCounter++
      } else if (player.pos == 'WR' && wrCounter == 0) {
        positions.wr1 = player
        wrCounter++
      } else if (player.pos == 'WR' && wrCounter == 1) {
        positions.wr2 = player
        wrCounter++
      } else if (player.pos == 'TE' && positions.te == null) {
        positions.te = player
      } else if (player.pos == 'K' && positions.k == null) {
        positions.k = player
      } else if (player.pos == 'RB' && player.pos != 'WR' && 
                  player.pos != 'TE' && positions.flex == null) {
        positions.flex = player
      } else if (player.pos == 'DST' && positions.dst == null) {
        positions.dst = player
      } else if (positions.b1 == null) {
        positions.b1 = player
      } else if (positions.b2 == null) {
        positions.b2 = player
      } else if (positions.b3 == null) {
        positions.b3 = player
      } else if (positions.b4 == null) {
        positions.b4 = player
      } else if (positions.b5 == null) {
        positions.b5 = player
      }
    })

    return positions;
  }

  getTeamImage(teamOwner: string) {
    return './../../assets/team-avatars/' + teamOwner + '.jpg'
  }
}
