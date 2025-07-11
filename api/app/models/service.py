from app.database.db import db

class Service(db.Model):
    _tablename_ = "services"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    garment_link = db.relationship("OrderDetail", backref="service",lazy=True)

    def to_dict(self, garment_link: bool = False):
        """ service = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
        }
        if garment_link:
            service['garment_link'] = self.garment_link
        return service """
        return self.__dict__