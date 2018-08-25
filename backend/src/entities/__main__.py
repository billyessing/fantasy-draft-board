# coding=utf-8

from flask_cors import CORS
from flask import Flask, jsonify, request

from .player import Player, PlayerSchema
from .team_owner import TeamOwner, TeamOwnerSchema
from .base import session_factory
from .data import populate_database

app = Flask(__name__)
CORS(app)

@app.route('/players')
def get_players():
    # fetching from the database
    player_objects = query_players(Player, False)

    # transforming into JSON-serializable objects
    schema = PlayerSchema(many=True)
    players = schema.dump(player_objects)

    # serializing as JSON
    return jsonify(players.data)


@app.route('/players-owned')
def get_players_owned():
    # fetching from the database
    player_objects = query_players(Player, True)

    # transforming into JSON-serializable objects
    schema = PlayerSchema(many=True)
    players = schema.dump(player_objects)

    # serializing as JSON
    return jsonify(players.data)


@app.route('/players-owned/<team_owner>')
def get_players_by_team(team_owner):
    session = session_factory()
    player_objects = session.query(Player).filter(Player.team_owner == team_owner).all()

    schema = PlayerSchema(many=True)
    players = schema.dump(player_objects)

    session.close()
    return jsonify(players.data)

@app.route('/teams')
def get_teams():
    # fetching from the database
    team_objects = query_teams(TeamOwner)

    # transforming into JSON-serializable objects
    schema = TeamOwnerSchema(many=True)
    team_owners = schema.dump(team_objects)

    # serializing as JSON
    return jsonify(team_owners.data)

@app.route('/players', methods=['POST'])
def add_player():
    # mount player object
    posted_player = PlayerSchema()\
        .load(request.get_json())

    player = Player(**posted_player.data)

    # persist player
    session = session_factory()

    session.add(player)
    session.commit()

    # return created player
    new_player = PlayerSchema().dump(player).data
    session.close()
    return jsonify(new_player), 201


@app.route('/teams', methods=['POST'])
def add_team_owner():
    # mount player object
    posted_team_owner = TeamOwnerSchema()\
        .load(request.get_json())

    team_owner = TeamOwner(**posted_team_owner.data)

    # persist player
    session = session_factory()

    session.add(team_owner)
    session.commit()

    # return created player
    new_team_owner = TeamOwnerSchema().dump(team_owner).data
    session.close()
    return jsonify(new_team_owner), 201


@app.route('/players/<player_id>', methods=['DELETE'])
def delete_player(player_id):
    session = session_factory()

    player = session.query(Player).filter(Player.id == player_id).first()
    session.delete(player)

    session.commit()
    session.close()
    return '', 201


def query_players(table, players_owned):
    session = session_factory()

    if (players_owned):
        query = session.query(table).filter(table.team_owner != None).all()
    else:
        query = session.query(table).filter(table.team_owner == None).all()

    session.close()
    return query


def query_teams(table):
    session = session_factory()
    query = session.query(table).all()

    session.close()
    return query


if __name__ == "__main__":
    populate_database()
