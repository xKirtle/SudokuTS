"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const World = 'world';
function hello(world = World) {
    return `Hello ${world}! `;
}
exports.hello = hello;
