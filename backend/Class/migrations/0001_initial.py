# Generated by Django 4.2.7 on 2023-12-06 18:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('User', '0001_initial'),
        ('Course', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('start_date', models.DateTimeField()),
                ('due_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('Not Started', 'Not Started'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='Not Started', max_length=20)),
                ('points', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('file', models.FileField(blank=True, null=True, upload_to='attachments/')),
                ('link', models.URLField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.user')),
            ],
        ),
        migrations.CreateModel(
            name='Class',
            fields=[
                ('classId', models.AutoField(primary_key=True, serialize=False)),
                ('classCode', models.CharField(max_length=100, unique=True)),
                ('className', models.CharField(max_length=255)),
                ('classDescription', models.TextField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Course.course')),
                ('students', models.ManyToManyField(related_name='classes', to='User.student')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('submission_text', models.TextField(blank=True)),
                ('submission_date', models.DateTimeField(auto_now_add=True)),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='Class.activity')),
                ('attachments', models.ManyToManyField(blank=True, related_name='submissions', to='Class.attachment')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.student')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('class_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Class.class')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Class.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.user')),
            ],
        ),
        migrations.AddField(
            model_name='activity',
            name='attachments',
            field=models.ManyToManyField(blank=True, related_name='activities', to='Class.attachment'),
        ),
        migrations.AddField(
            model_name='activity',
            name='class_instance',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Class.class'),
        ),
        migrations.AddField(
            model_name='activity',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.teacher'),
        ),
        migrations.CreateModel(
            name='JoinRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_accepted', models.BooleanField(default=False)),
                ('class_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Class.class')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.student')),
            ],
            options={
                'unique_together': {('class_instance', 'student')},
            },
        ),
    ]
