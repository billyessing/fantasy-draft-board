import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from './../env';
import { PlayerModel } from './../models/player.model';
import { TeamOwnerModel } from './../models/team-owner.model';

// import * as Auth0 from 'auth0-web';

@Injectable()
export class DataService {

  player = new PlayerModel('', '', null, null, '', '')
  team = new TeamOwnerModel('', '', null);
  currPick = {
    team: this.team,
    player: this.player
  }

  playerSource = new BehaviorSubject(this.currPick);
  addPlayerNotif = this.playerSource.asObservable();

  constructor(private http: HttpClient) {

  }

  playerAddedNotif(player: any) {
    this.playerSource.next(player)
  }

  // GET
  getPlayers(playersOwned, teamOwner): Observable<PlayerModel[]> {
    let url = `${API_URL}/players` + playersOwned + `${teamOwner}`

    return this.http
      .get<PlayerModel[]>(url)
      .pipe(
        catchError(DataService._handleError)
      )
  }

  getTeams(): Observable<TeamOwnerModel[]> {
    return this.http
      .get<TeamOwnerModel[]>(`${API_URL}/teams`)
      .pipe(
        catchError(DataService._handleError)
      )
  }

  // POST
  savePlayer(player: any): Observable<any[]> {
    return this.http
      .post<any[]>(`${API_URL}/players`, player);
  }
  
  saveTeam(team: any): Observable<any[]>  {
    return this.http
      .post<any[]>(`${API_URL}/teams`, team);
  } 

  deletePlayer(playerId: number): Observable<any[]> {
    return this.http
      .delete<any[]>(`${API_URL}/players/${playerId}`)
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return throwError(err.message || 'Error: Unable to complete request.');
  }

}