# Generated by Django 4.2.4 on 2023-12-08 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_premium',
            field=models.BooleanField(default=False),
        ),
    ]