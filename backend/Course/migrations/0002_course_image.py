# Generated by Django 4.2.7 on 2023-11-20 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='image',
            field=models.ImageField(default='default.png', upload_to='images/'),
        ),
    ]