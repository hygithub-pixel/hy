| name | description |
|---|---|
| spec-writing | Write comprehensive design specifications and technical documentation. Translate requirements into structured, actionable spec documents that guide implementation. |

# Spec Writing Skill

## Overview

Create well-structured design specifications and technical documentation from requirements. This skill focuses on documenting architecture, components, data flow, and implementation details in a standardized format.

## When to Use

Use this skill when you need to:
- Document a technical design or specification
- Write API documentation
- Create system architecture documents
- Document feature requirements and implementation plans
- Generate spec docs without requiring prior brainstorming workflow

## The Process

**Understanding Requirements:**
- Review any existing requirements or design notes
- Clarify ambiguous points with targeted questions
- Identify key components, interfaces, and dependencies

**Structuring the Document:**
- Start with a clear title and purpose statement
- Break content into logical sections
- Use consistent formatting throughout

**Document Sections:**
1. **Overview** - Purpose and scope of the feature/system
2. **Requirements** - Functional and non-functional requirements
3. **Architecture** - High-level system design and components
4. **Data Flow** - Information flow between components
5. **API Design** - Endpoints, request/response schemas
6. **Error Handling** - Error scenarios and handling strategies
7. **Testing** - Test coverage and strategies
8. **Security** - Security considerations and best practices

**Writing Guidelines:**
- Use clear, concise language
- Maintain consistent terminology
- Include diagrams where helpful
- Reference related documents and standards

## Output Format

**File Location:**
- Save to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Use hyphenated lowercase filenames

**Commit:**
- Commit the design document to git after completion

## Post-Documentation Workflow

After successfully writing the spec document, automatically transition to implementation workflow:

**1. Transition to Implementation:**
- Invoke `writing-plans` skill to create detailed implementation plan
- Optionally use `using-git-worktrees` skill to create isolated workspace
- Follow with `test-driven-development` for implementation

**2. Skill Transition Flow:**
```
Spec Document Written → writing-plans → Implementation Skills
                          ↓
                   using-git-worktrees (optional)
                          ↓
                   test-driven-development
                          ↓
                   verification-before-completion
```

## Key Principles

- **Clarity** - Make the spec easy to understand for all stakeholders
- **Completeness** - Cover all aspects necessary for implementation
- **Actionable** - Provide enough detail for developers to implement
- **Maintainable** - Structure for future updates and revisions
- **Reviewable** - Organize content for easy peer review