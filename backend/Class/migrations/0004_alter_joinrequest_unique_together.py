# Generated by Django 4.2.4 on 2023-11-29 14:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0001_initial'),
        ('Class', '0003_joinrequest'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='joinrequest',
            unique_together={('class_instance', 'student')},
        ),
    ]
