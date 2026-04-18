from typing import Optional
from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, JSON, TIMESTAMP, UniqueConstraint, event, MetaData, Float, DateTime
from sqlalchemy.orm import relationship, declarative_base
from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from datetime import datetime, date

# Создаем экземпляр MetaData
metadata = MetaData()

# Создаем базовый класс с использованием MetaData
Base = declarative_base(metadata=metadata)

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('user_metadata.user_metadata_id', onupdate="CASCADE", ondelete="SET NULL"))
    recipient_id = Column(Integer, ForeignKey('user_metadata.user_metadata_id', onupdate="CASCADE", ondelete="SET NULL"))
    message = Column(String, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    delivered = Column(Boolean, default=False)

    sender = relationship("UserMetadata", foreign_keys=[sender_id])
    recipient = relationship("UserMetadata", foreign_keys=[recipient_id])

class UserMetadata(Base):
    __tablename__ = "user_metadata"

    avatar_image = Column(String)
    user_metadata_id = Column(Integer, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    user_name = Column(String)
    user_surname = Column(String)
    user_patronymic = Column(String)
    age = Column(String)
    isActive = Column(Boolean, default=False)
    status = Column(Boolean, default=True)

    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    

    country = relationship("Country", back_populates="users")
    city = relationship("City", back_populates="users")

    __table_args__ = (
        UniqueConstraint('email', name='uq_user_metadata_email'),
        UniqueConstraint('hashed_password', name='uq_user_metadata_hashed_password'),
    )

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    createdat = Column(TIMESTAMP, default=datetime.utcnow)

    user_metadata_id = Column(Integer, ForeignKey("user_metadata.user_metadata_id", onupdate="CASCADE", ondelete="CASCADE"))

     # роли
    is_volunteer = Column(Boolean, default=True)
    is_cityadm = Column(Boolean, default=False)
    is_regionadm = Column(Boolean, default=False)
    is_superadm = Column(Boolean, default=False)

    events = relationship("Event", back_populates="creator")
    registrations = relationship("EventRegistration", back_populates="user")
    volunteer_orgs = relationship("UserVolunteerOrg", back_populates="user")

# Событие для синхронизации данных
@event.listens_for(UserMetadata, 'after_insert')
def create_user_from_metadata(mapper, connection, target):
    connection.execute(
        User.__table__.insert().values(
            email=target.email,
            hashed_password=target.hashed_password,
            user_metadata_id=target.user_metadata_id
        )
    )

# Обновление данных при изменении
@event.listens_for(UserMetadata, 'after_update')
def update_user_from_metadata(mapper, connection, target):
    connection.execute(
        User.__table__.update().
        where(User.user_metadata_id == target.user_metadata_id).
        values(email=target.email, hashed_password=target.hashed_password)
    )


class Country(Base):
    __tablename__ = "country"

    country_id = Column(Integer, primary_key=True, unique=True)
    country_name = Column(String)

    city = relationship("City", back_populates="country")
    users = relationship("UserMetadata", back_populates="country")
    events = relationship("Event", back_populates="country")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="country")
    class Config:
        orm_mode = True

class City(Base):
    __tablename__ = "city"

    city_id = Column(Integer, primary_key=True, unique=True)
    city_name = Column(String)

    country_id = Column(Integer, ForeignKey("country.country_id"))
    country = relationship("Country", back_populates="city")
    users = relationship("UserMetadata", back_populates="city")
    events = relationship("Event", back_populates="city")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="city")
    class Config:
        orm_mode = True

class VolunteerOrg(Base):
    __tablename__ = "volunteer_org"

    vol_id = Column(Integer, primary_key=True, unique=True)
    vol_name = Column(String)
    vol_description = Column(String)
    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    vol_foundation_date = Column(Date)
    vol_contact_person = Column(Integer)
    vol_phone = Column(Integer)
    vol_email = Column(String)
    vol_status = Column(Boolean)
    vol_count_members = Column(Integer)

    country = relationship("Country", back_populates="volunteer_orgs")
    city = relationship("City", back_populates="volunteer_orgs")
    members = relationship("UserVolunteerOrg", back_populates="volunteer_org")
    class Config:
        orm_mode = True

class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, unique=True)
    event_name = Column(String)
    short_description = Column(String)
    full_description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    category_id = Column(Integer, ForeignKey("category.category_id", onupdate="CASCADE", ondelete="SET NULL"))
    required_volunteers = Column(Integer)
    registered_volunteers = Column(Integer)
    participation_points = Column(Integer)
    rewards = Column(String)
    image = Column(String)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    creation_date = Column(Date)
    event_status = Column(Boolean)
    latitude = Column(Float)
    longitude = Column(Float)

    country = relationship("Country", back_populates="events")
    city = relationship("City", back_populates="events")
    category = relationship("Category", back_populates="events")
    creator = relationship("User", back_populates="events")
    registrations = relationship("EventRegistration", back_populates="event")
    class Config:
        orm_mode = True

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, unique=True)
    category_name = Column(String, unique=True)

    events = relationship("Event", back_populates="category")
    class Config:
        orm_mode = True

class EventRegistration(Base):
    __tablename__ = "event_registration"

    registration_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    event_id = Column(Integer, ForeignKey("event.event_id", onupdate="CASCADE", ondelete="CASCADE"))
    registration_date = Column(Date)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    class Config:
        orm_mode = True

class UserVolunteerOrg(Base):
    __tablename__ = "user_volunteer_org"

    user_volunteer_org_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    vol_id = Column(Integer, ForeignKey("volunteer_org.vol_id", onupdate="CASCADE", ondelete="CASCADE"))
    join_date = Column(Date)

    user = relationship("User", back_populates="volunteer_orgs")
    volunteer_org = relationship("VolunteerOrg", back_populates="members")
    class Config:
        orm_mode = True

# PYDANTIC

class UserAvatarUpdate(BaseModel):
    avatar_image: HttpUrl

class EventRegister(BaseModel):
    event_id: int

class UserMetadataCreate(BaseModel):
    username: str  # для совместимости с запросом
    hashed_password: str = Field(..., min_length=8, max_length=100)
    user_name: str = Field(..., min_length=2)
    user_surname: str = Field(..., min_length=2)
    user_patronymic: Optional[str] = None # может не быть отца
    age: int = Field(..., ge=14) # условимся на том, что сайт 14+
    country: int 
    city: int

class UserMetadataRead(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int

    class Config:
        orm_mode = True

class UserMetadataReadProfile(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int
    country_name: Optional[str]
    city_name: Optional[str]

    class Config:
        orm_mode = True


class UserMetadataReadForChat(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int

    class Config:
        orm_mode = True


class CountryCreate(BaseModel):
    country_id: int
    country_name: str = Field(..., min_length=2, max_length=100)
    class Config:
        orm_mode = True

class CityCreate(BaseModel):
    city_id: int
    country_id: int
    city_name: str = Field(..., min_length=2, max_length=100)
    class Config:
        orm_mode = True



class EventRead(BaseModel):
    """Ответ API: совпадает с фактическими строками БД (DATE, короткие тексты, NULL)."""

    event_id: int
    event_name: Optional[str] = ""
    short_description: Optional[str] = ""
    full_description: Optional[str] = ""
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category_name: Optional[str] = None
    required_volunteers: Optional[int] = 0
    participation_points: Optional[int] = 0
    rewards: Optional[str] = None
    registered_volunteers: Optional[int] = 0
    country_name: Optional[str] = None
    city_name: Optional[str] = None
    user_id: Optional[int] = None
    image: Optional[str] = None
    creation_date: Optional[date] = None
    event_status: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @validator("start_date", "end_date", "creation_date", pre=True)
    def coerce_sql_date(cls, v):
        if v is None:
            return None
        if isinstance(v, datetime):
            return v.date()
        return v

    class Config:
        orm_mode = True


class CategoryItem(BaseModel):
    category_id: int
    category_name: str

    class Config:
        orm_mode = True

class EventCreate(BaseModel):
    """Тело POST /events/ — ограничения смягчены, чтобы форма не отдавала 422 при коротких черновиках."""

    event_name: str = Field(..., min_length=1, max_length=200)
    short_description: str = Field(..., min_length=1, max_length=500)
    full_description: str = Field(..., min_length=1, max_length=4000)
    start_date: str
    end_date: str
    category_name: str = Field(..., min_length=1, max_length=120)
    required_volunteers: int = Field(0, ge=0)
    participation_points: int = Field(0, ge=0)
    rewards: str = ""
    image: str = ""
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)

    class Config:
        orm_mode = True

    @validator("start_date", "end_date")
    def strip_dates(cls, v):
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("Дата не может быть пустой")
        return v

    @validator("end_date")
    def validate_end_date(cls, end_date, values):
        start = values.get("start_date")
        if start and end_date < start:
            raise ValueError("Дата окончания не может быть раньше даты начала")
        return end_date