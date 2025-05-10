'use client';

import { Edit, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

import { Button, Card, CardContent, Input } from '@/components/ui';
import { updateUserName } from '@/lib/api';
import { User } from '@/types/shared';

interface UserNameCardProps {
  user: User;
  onNameUpdated?: () => void;
}

export function UserNameCard({ user, onNameUpdated }: UserNameCardProps) {
  const [name, setName] = useState(user.name || '');
  const [isEditing, setIsEditing] = useState(!user.name);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!name.trim()) {
      return;
    }

    try {
      const result = await updateUserName(user.id, name.trim());
      if (result) {
        setIsEditing(false);
        onNameUpdated?.();
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleCancel = () => {
    setName(user.name || '');
    setIsEditing(false);
  };

  return (
    <Card className="py-3">
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Input
                id="username"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Please enter your name"
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={!name.trim()} className="flex-shrink-0 ml-2">
              Save
            </Button>
            {user.name && (
              <Button
                type="button"
                variant="secondary"
                className="flex-shrink-0 ml-2"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-md font-semibold text-foreground ml-2">{name}</div>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/90"
            >
              <Edit size={20} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
