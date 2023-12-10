# Generated by Django 4.2.7 on 2023-12-07 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Class', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='is_returned',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name='submission',
            name='score',
            field=models.PositiveIntegerField(blank=True, default=0),
            preserve_default=False,
        ),
    ]