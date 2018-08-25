# coding=utf-8

from marshmallow import Schema, fields
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from .base import Base


class TeamOwner(Base):
    __tablename__ = 'team_owner'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    pick = Column(Integer)

    def __init__(self, name, pick):
        self.name = name
        self.pick = pick

class TeamOwnerSchema(Schema):
    id = fields.Number()
    name = fields.Str()
    pick = fields.Number()
