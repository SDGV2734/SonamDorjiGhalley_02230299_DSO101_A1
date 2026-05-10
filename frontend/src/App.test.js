import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import axios from 'axios';

// Mock axios — tests run without a real backend
jest.mock('axios');

const mockTasks = [
  { id: 1, title: 'Buy groceries' },
  { id: 2, title: 'Do laundry' },
];

beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockTasks });
  axios.post.mockResolvedValue({ data: { id: 3, title: 'New task' } });
  axios.put.mockResolvedValue({ data: { id: 1, title: 'Updated task' } });
  axios.delete.mockResolvedValue({ data: { message: 'Task deleted' } });
});

test('renders My Tasks heading', async () => {
  render(<App />);
  const heading = screen.getByRole('heading');
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent('My Tasks');
});

test('renders input field for new tasks', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('What needs to be done?');
  expect(input).toBeInTheDocument();
});

test('renders Add button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /add/i });
  expect(button).toBeInTheDocument();
});

test('displays tasks fetched from the API', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Do laundry')).toBeInTheDocument();
  });
});

test('allows user to type a new task', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('What needs to be done?');
  fireEvent.change(input, { target: { value: 'Walk the dog' } });
  expect(input.value).toBe('Walk the dog');
});

test('calls POST when Add button is clicked', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText('What needs to be done?');
  fireEvent.change(input, { target: { value: 'New task' } });
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
});

test('renders Edit button for each task', async () => {
  render(<App />);
  await waitFor(() => {
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBe(mockTasks.length);
  });
});

test('renders Delete button for each task', async () => {
  render(<App />);
  await waitFor(() => {
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBe(mockTasks.length);
  });
});