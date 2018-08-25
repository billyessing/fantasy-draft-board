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
    team_owner = Column(String)

    def __init__(self, name, pos, rank, rank_pos, team_owner):
        self.name = name
        self.pos = pos
        self.rank = rank
        self.rank_pos = rank_pos
        self.team_owner = team_owner

class PlayerSchema(Schema):
    id = fields.Number()
    name = fields.Str()
    pos = fields.Str()
    rank = fields.Number()
    rank_pos = fields.Number()
    team_owner = fields.Str()

