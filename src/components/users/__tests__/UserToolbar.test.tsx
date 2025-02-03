import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserToolbar } from '../UserToolbar';

describe('UserToolbar', () => {
  it('renders nothing when no users are selected', () => {
    const { container } = render(
      <UserToolbar
        selectedCount={0}
        onExport={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders toolbar with correct count when users are selected', () => {
    render(
      <UserToolbar
        selectedCount={2}
        onExport={() => {}}
        onDelete={() => {}}
      />
    );
    
    expect(screen.getByText('2 users selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('handles export and delete actions', () => {
    const onExport = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <UserToolbar
        selectedCount={1}
        onExport={onExport}
        onDelete={onDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    expect(onExport).toHaveBeenCalled();
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalled();
  });
});