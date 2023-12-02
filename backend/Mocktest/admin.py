from django.contrib import admin
from .models import MockTest, MockQuestions, MockTestScores

class MockQuestionsInline(admin.TabularInline):
    model = MockQuestions
    extra = 1

class MockTestAdmin(admin.ModelAdmin):
    inlines = [MockQuestionsInline]

# Register your models here.
admin.site.register(MockTest, MockTestAdmin)
admin.site.register(MockQuestions)
admin.site.register(MockTestScores)