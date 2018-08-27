# coding=utf-8

from marshmallow import Schema, fields
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base
from .team_owner import TeamOwnerSchema


class Player(Base):
    __tablename__ = 'player'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    pos = Column(String)
    rank = Column(Integer)
    rank_pos = Column(Integer)
    team = Column(String)
    bye = Column(Integer)
    team_owner = Column(String)

    def __init__(self, rank, name, team, pos, rank_pos, bye, team_owner):
        self.rank = rank
        self.name = name
        self.team = team
        self.pos = pos
        self.rank_pos = rank_pos
        self.bye = bye
        self.team_owner = team_owner

class PlayerSchema(Schema):
    id = fields.Number()
    name = fields.Str()
    pos = fields.Str()
    rank = fields.Number()
    rank_pos = fields.Number()
    team = fields.Str()
    bye = fields.Number()
    team_owner = fields.Str()

