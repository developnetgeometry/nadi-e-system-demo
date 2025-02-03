import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserTableRow } from '../UserTableRow';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  full_name: 'Test User',
  user_type: 'member',
  created_at: '2024-01-01',
};

describe('UserTableRow', () => {
  it('renders user data correctly', () => {
    render(
      <UserTableRow
        user={mockUser}
        isSelected={false}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('member')).toBeInTheDocument();
  });

  it('handles selection', () => {
    const onSelect = vi.fn();
    render(
      <UserTableRow
        user={mockUser}
        isSelected={false}
        onSelect={onSelect}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelect).toHaveBeenCalledWith('1', true);
  });
});