# Generated by Django 4.2.4 on 2023-12-10 17:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Mocktest', '0008_mocktest_classid_delete_classmocktest'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mockquestions',
            name='mocktest',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mockquestions', to='Mocktest.mocktest'),
        ),
    ]