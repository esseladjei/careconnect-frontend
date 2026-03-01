import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../helpers/test-utils';
import userEvent from '@testing-library/user-event';
import PhoneInput from '../../src/components/PhoneInput';

describe('PhoneInput - Component Tests', () => {
  it('renders phone input field', () => {
    render(<PhoneInput id="phone" name="phone" value="" onChange={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('displays required asterisk when required prop is true', () => {
    render(
      <PhoneInput
        id="phone"
        name="phone"
        value=""
        onChange={vi.fn()}
        required={true}
      />
    );

    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });

  it('displays optional text when required is false', () => {
    render(
      <PhoneInput
        id="phone"
        name="phone"
        value=""
        onChange={vi.fn()}
        required={false}
      />
    );

    expect(screen.getByText(/Optional/)).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Invalid phone number';
    render(
      <PhoneInput
        id="phone"
        name="phone"
        value="invalid"
        onChange={vi.fn()}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PhoneInput id="phone" name="phone" value="" onChange={handleChange} />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '0241234567');

    expect(handleChange).toHaveBeenCalled();
  });

  it('displays help text with operator information', () => {
    render(<PhoneInput id="phone" name="phone" value="" onChange={vi.fn()} />);

    expect(screen.getByText(/MTN/)).toBeInTheDocument();
    expect(screen.getByText(/Vodafone/)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <PhoneInput
        id="phone"
        name="phone"
        value=""
        onChange={vi.fn()}
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('accepts custom className', () => {
    const { container } = render(
      <PhoneInput
        id="phone"
        name="phone"
        value=""
        onChange={vi.fn()}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('shows operator info when valid MTN number is provided', () => {
    render(
      <PhoneInput
        id="phone"
        name="phone"
        value="0241234567"
        onChange={vi.fn()}
        showOperatorInfo={true}
      />
    );

    expect(screen.getByText(/MTN Ghana/)).toBeInTheDocument();
  });
});
