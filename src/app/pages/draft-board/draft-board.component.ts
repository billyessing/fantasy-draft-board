import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, from, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { PlayerFilterService } from '../../services/player-filter.service';
import { PlayerModel } from '../../models/player.model';
import { FilterOption } from '../../models/filter-group.model';
import { ThrowStmt } from '../../../../node_modules/@angular/compiler';


@Component({
  selector: 'app-draft-board',
  templateUrl: './draft-board.component.html',
  styleUrls: ['./draft-board.component.scss']
})
export class DraftBoardComponent implements OnInit {

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

  // just because this would typically be async data
  players$: Observable<PlayerModel[]> = of([
    new PlayerModel('Todd Gurley', 'RB', 'LAR', 1, 1),
    new PlayerModel('LeVeon Bell', 'RB', 'PIT', 2, 2),
    new PlayerModel('David Johnson', 'RB', 'ARI', 3, 3),
    new PlayerModel('Tom Brady', 'QB', 'NE', 4, 1),
    new PlayerModel('Julio Jones', 'WR', 'ATL', 5, 1),
    new PlayerModel('Odell Beckham', 'WR', 'NYG', 6, 2),
    new PlayerModel('Travis Kelce', 'TE', 'KC', 40, 2),
    new PlayerModel('RB', 'K', 'ATL', 10, 10),
    new PlayerModel('Tester', 'K', 'ATL', 333, 333),
    new PlayerModel('Justin Tucker', 'K', 'BAL', 200, 1),
    new PlayerModel('Minnesota Vikings', 'D/ST', 'JAC', 201, 1),
    new PlayerModel('Todd Gurley', 'RB', 'LAR', 1, 1),
    new PlayerModel('LeVeon Bell', 'RB', 'PIT', 2, 2),
    new PlayerModel('David Johnson', 'RB', 'ARI', 3, 3),
    new PlayerModel('Tom Brady', 'QB', 'NE', 4, 1),
    new PlayerModel('Julio Jones', 'WR', 'ATL', 5, 1),
    new PlayerModel('Odell Beckham', 'WR', 'NYG', 6, 2),
    new PlayerModel('Travis Kelce', 'TE', 'KC', 40, 2),
    new PlayerModel('RB', 'K', 'ATL', 10, 10),
    new PlayerModel('Tester', 'K', 'ATL', 333, 333),
    new PlayerModel('Justin Tucker', 'K', 'BAL', 200, 1),
    new PlayerModel('Minnesota Vikings', 'D/ST', 'JAC', 201, 1),
  ])

  filteredPlayers$: Observable<PlayerModel[]>;

  constructor(
    private playerFilterService: PlayerFilterService
  ) { }

  ngOnInit() {
    this.filteredPlayers$ = this.players$;
  }

  filterPlayers(query: any, filterOption: FilterOption) {
    this.filteredPlayers$ = this.playerFilterService.getFilteredStream(
      this.players$,
      query,
      filterOption.props
    );
  }

  removePlayer(player: PlayerModel) {
    this.players$.subscribe(res => {
      let index = res.findIndex(x => x.name == player.name);
      res.splice(index, 1);
      
      // hacky way of resetting search so that player is immediately removed
      this.filterPlayers('', { props: '', label: '' })
    })

  }

}
