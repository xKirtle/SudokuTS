const World = 'world';

export function hello(world: string = World): string {
  return `Hello ${world}! `;
}