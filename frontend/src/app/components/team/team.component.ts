import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, from, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { PlayerFilterService } from '../../services/player-filter.service';
import { PlayerModel } from '../../models/player.model';
import { TeamOwnerModel } from '../../models/team-owner.model';
import { FilterOption } from '../../models/filter-group.model';
import { ThrowStmt } from '@angular/compiler';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  teams: any[] = [];
  player: PlayerModel;

  positions = [
    'QB', 
    'RB', 'RB',
    'WR', 'WR',
    'TE',
    'FLEX',
    'K',
    'D/ST',
    'Bench', 'Bench', 
    'Bench', 'Bench', 'Bench'
  ]

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.addPlayerNotif
      .subscribe(player => {
        this.teams = []
        this.getTeams();
      })

  }

  getTeams() {
    this.dataService.getTeams()
      .subscribe(teams => {
        teams.forEach(team => {
          this.getPlayers(team.name);
        })
      })
  }

  getPlayers(team) {
    this.dataService.getPlayers('-owned', `/${team}`)
      .subscribe(players => {
        let teamInfo = {
          owner: team,
          players: this.fillPositions(players)
        }

        this.teams.push(teamInfo)
      })
  }

  fillPositions(players) {
    let positions = {
      'qb': null,
      'rb1': null, 'rb2': null,
      'wr1': null, 'wr2': null,
      'te': null,
      'flex': null,
      'k': null,
      'dst': null,
      'b1': null, 'b2': null,
      'b3': null, 'b4': null, 'b5': null,
    }

    let rbCounter = 0
    let wrCounter = 0

    // disgusting code... couldn't figure out any other logic 
    players.forEach(player => {
      if (player.pos == 'QB' && positions.qb == null) {
        positions.qb = player.name
      } else if (player.pos == 'RB' && rbCounter == 0) {
        positions.rb1 = player.name
        rbCounter++;
      } else if (player.pos == 'RB' && rbCounter == 1) {
        positions.rb2 = player.name
        rbCounter++
      } else if (player.pos == 'WR' && wrCounter == 0) {
        positions.wr1 = player.name
        wrCounter++
      } else if (player.pos == 'WR' && wrCounter == 1) {
        positions.wr2 = player.name
        wrCounter++
      } else if (player.pos == 'TE' && positions.te == null) {
        positions.te = player.name
      } else if (player.pos != 'QB' && player.pos != 'K' && 
                  player.pos != 'D/ST' && positions.flex == null) {
        positions.flex = player.name
      } else if (player.pos == 'D/ST' && positions.dst == null) {
        positions.dst = player.name
      } else if (positions.b1 == null) {
        positions.b1 = player.name
      } else if (positions.b2 == null) {
        positions.b2 = player.name
      } else if (positions.b3 == null) {
        positions.b3 = player.name
      } else if (positions.b4 == null) {
        positions.b4 = player.name
      } else if (positions.b5 == null) {
        positions.b5 = player.name
      }

    })

    return positions;
  }

}
