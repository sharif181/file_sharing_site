from rest_framework import serializers
from .models import File, Folder
from django.urls import reverse_lazy


class FileSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['content', 'created_at', 'id', 'name', 'size', 'path', 'folder']
        read_only_fields = ('user', )

    def get_path(self, obj):
        return obj.content.url

    def create(self, validated_data):
        print(validated_data)
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        # fields = '__all__'
        exclude = ('permission', )
        read_only_fields = ('user', )

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        print(validated_data)
        return super().create(validated_data)


class SubFolderDetailsSerializer(serializers.ModelSerializer):
    folder = FolderSerializer(source='child_folder', many=True, read_only=True)
    file = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['folder', 'file', 'name']

