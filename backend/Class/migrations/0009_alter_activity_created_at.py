# Generated by Django 4.2.4 on 2023-12-03 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Class', '0008_activity_attachment_submission_activity_attachments_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='created_at',
            field=models.DateTimeField(editable=False),
        ),
    ]