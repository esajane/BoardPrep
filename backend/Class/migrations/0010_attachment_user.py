# Generated by Django 4.2.4 on 2023-12-04 03:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_user_user_type'),
        ('Class', '0009_alter_activity_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='attachment',
            name='user',
            field=models.ForeignKey(default='teacher1', on_delete=django.db.models.deletion.CASCADE, to='User.user'),
            preserve_default=False,
        ),
    ]
