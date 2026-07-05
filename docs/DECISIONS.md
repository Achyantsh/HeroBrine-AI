# ADR-001: Domain-Centric Design

## Status
Accepted

## Context

HeroBrine AI is not a traditional task manager.

The platform revolves around a universal Commitment entity that represents obligations, deadlines, meetings, routines, and goals.

## Decision

The backend will be designed around the Commitment domain instead of generic task management.

## Consequences

- Easier to extend to new commitment types.
- AI reasoning is centralized.
- Future scheduling and dependency features integrate naturally.
