# Generated by Django 4.2.7 on 2023-12-10 21:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0004_alter_user_user_type_contentcreator'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contentcreator',
            name='institution_id',
        ),
        migrations.RemoveField(
            model_name='contentcreator',
            name='specialization',
        ),
    ]
