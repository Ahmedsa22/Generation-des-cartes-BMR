from django.db import models





class Users(models.Model):
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    permissions = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'users'



