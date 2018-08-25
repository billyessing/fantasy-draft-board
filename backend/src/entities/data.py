# coding=utf-8

from .player import Player, PlayerSchema
from .team_owner import TeamOwner, TeamOwnerSchema
from .base import session_factory

def populate_database():
    session = session_factory()

    teams = [
        TeamOwner("Billy", 1),
        TeamOwner("Justin", 2),
        TeamOwner("Hayden", 3)
    ]

    players = [
        Player("Tom Brady", "QB", 2, 5, None),
        Player("Antonio Brown", "WR", 2, 1, None),
        Player("Julio Jones", "WR", 3, 5, None),
        Player("Deshaun Watson", "QB", 4, 4, None),
        Player("Todd Gurley", "RB", 1, 1, None),
        Player("Odell Beckham Jr", "WR", 4, 4, None),
        Player("Jimmy Graham", "TE", 1, 1, None),
        Player("Dion Lewis", "RB", 2, 2, None),
        Player("Rob Gronkowski", "TE", 3, 3, None),
        Player("Zach Ertz", "TE", 4, 4, None)
    ]

    for team in teams:
        session.add(team)

    for player in players:
        session.add(player)

    session.commit()
    session.close()
