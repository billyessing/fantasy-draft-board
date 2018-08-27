import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PlayerModel } from '../../models/player.model';
import { TeamOwnerModel } from '../../models/team-owner.model';
import { FilterOption } from '../../models/filter-group.model';
import { DataService } from '../../services/data.service';
import { PlayerFilterService } from '../../services/player-filter.service';

@Component({
  selector: 'app-draft-board',
  templateUrl: './draft-board.component.html',
  styleUrls: ['./draft-board.component.scss']
})
export class DraftBoardComponent implements OnInit {

  teams$: Observable<TeamOwnerModel[]>
  currTeam: TeamOwnerModel;

  players$: Observable<PlayerModel[]>;
  filteredPlayers$: Observable<PlayerModel[]>;

  pickCounter: number = 1;
  roundCounter: number = 1;
  mode = new FormControl('side');

  public filterOptions: FilterOption[] = [
    { props: '', label: 'All' },
    { props: ['QB'], label: 'QB' },
    { props: ['RB'], label: 'RB' },
    { props: ['WR'], label: 'WR' },
    { props: ['TE'], label: 'TE' },
    { props: ['K'], label: 'K' },
    { props: ['DST'], label: 'D/ST' }
  ]

  constructor(
    private dataService: DataService,
    private playerFilterService: PlayerFilterService
  ) { }

  ngOnInit() {
    this.teams$ = this.dataService.getTeams();
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

  autoPick() {
    this.dataService.getPlayers('', '')
      .subscribe(players => {
        this.addPlayer(players[0])
      })
  }

  addPlayer(player: PlayerModel) {
    if (!this.currTeam) {
      console.log("Select team to add player...")
      return;
    }

    this.updateDatabase(player);
  }

  updateDatabase(player: PlayerModel) {
    let id = player['id'];
    let draftedPlayer = player;

    delete draftedPlayer['id']
    draftedPlayer['team_owner'] = this.currTeam.owner;

    this.dataService.deletePlayer(id)
      .subscribe(() =>
        this.filteredPlayers$ = this.dataService.getPlayers('', '')
      ),
      console.error

    this.dataService.savePlayer(draftedPlayer)
      .subscribe(),
      console.error

    this.notifyTeams(draftedPlayer)
  }

  notifyTeams(draftedPlayer: PlayerModel) {
    // console.log(this.currTeam);
    // console.log(draftedPlayer);
    this.dataService.playerAddedNotif({
      team: this.currTeam,
      player: draftedPlayer
    })

    if (this.pickCounter % 12 == 0) {
      // this.pickCounter = 1;
      this.roundCounter++;
    }

    this.pickCounter++;
  }

}
