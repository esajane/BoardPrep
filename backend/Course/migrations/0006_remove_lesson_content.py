# Generated by Django 4.2.7 on 2023-11-28 12:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Course', '0005_rename_overview_syllabus_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='content',
        ),
    ]
