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
  selector: 'app-draft-board',
  templateUrl: './draft-board.component.html',
  styleUrls: ['./draft-board.component.scss']
})
export class DraftBoardComponent implements OnInit {

  players$: Observable<PlayerModel[]>;
  filteredPlayers$: Observable<PlayerModel[]>;

  mode = new FormControl('side');

  public filterOptions: FilterOption[] = [
    { props: '', label: 'All' },
    { props: ['QB'], label: 'QB' },
    { props: ['RB'], label: 'RB' },
    { props: ['WR'], label: 'WR' },
    { props: ['TE'], label: 'TE' },
    { props: ['K'], label: 'K' },
    { props: ['D/ST'], label: 'D/ST' }
  ]

  player: PlayerModel;

  constructor(
    private dataService: DataService,
    private playerFilterService: PlayerFilterService
  ) { }

  ngOnInit() {
    this.dataService.addPlayerNotif.subscribe(player => this.player = player)

    this.players$ = this.dataService.getPlayers('', '');
    this.filteredPlayers$ = this.players$;
  }

  filterPlayers(query: any, filterOption: FilterOption) {
    this.filteredPlayers$ = this.playerFilterService.getFilteredStream(
      this.players$,
      query,
      filterOption.props
    );
  }

  addPlayer(player: PlayerModel) {
    let id = player['id'];
    let draftedPlayer = player;
    
    delete draftedPlayer['id']
    draftedPlayer['team_owner'] = "Billy";

    this.dataService.deletePlayer(id)
      .subscribe(res => {
        this.filteredPlayers$ = this.dataService.getPlayers('', '');
        console.log(res)
      },
        console.error
    )
      
    this.dataService.savePlayer(draftedPlayer)
      .subscribe(res => {
        console.log(res)
      },
      console.error
    )

    this.newMessage(draftedPlayer)
  }

  newMessage(draftedPlayer: PlayerModel) {
    this.dataService.playerAddedNotif(draftedPlayer)
  }

}
