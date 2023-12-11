from django.contrib import admin
from django.db.models import Count
from .models import MockTest, MockQuestions, MockTestScores
from Class.models import Class


class MockQuestionsInline(admin.TabularInline):
    model = MockQuestions
    extra = 1

class MockTestAdmin(admin.ModelAdmin):
    inlines = [MockQuestionsInline]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "classID":
            # Find classes that are not yet linked to a MockTest
            kwargs["queryset"] = Class.objects.annotate(num_mocktests=Count('mocktest')).filter(num_mocktests=0)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

# Register your models here.
admin.site.register(MockTest, MockTestAdmin)
admin.site.register(MockQuestions)
admin.site.register(MockTestScores)