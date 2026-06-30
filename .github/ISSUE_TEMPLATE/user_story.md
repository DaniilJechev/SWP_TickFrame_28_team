name: User Story
about: Create a new User Story issue for the product backlog.

title: "US-XXX: Short summary"
labels: ["User Story", "PBI"]

body:
  - type: markdown
    attributes:
      value: |-
        ## User Story
  - type: input
    id: stable_id
    attributes:
      label: Stable user story ID
      description: Use the preserved stable ID from reports/week2/user-stories.md
      placeholder: US-001
  - type: textarea
    id: story_statement
    attributes:
      label: User story statement
      description: As a [user persona], I want to ..., so that ...
  - type: dropdown
    id: moscow_priority
    attributes:
      label: MoSCoW priority
      options:
        - Must Have
        - Should Have
        - Could Have
        - Won't Have
  - type: textarea
    id: notes_constraints
    attributes:
      label: Notes, constraints, assumptions, open questions
      description: Add any relevant details from the Assignment 2 story.
  - type: dropdown
    id: work_status
    attributes:
      label: Work Status
      options:
        - To Do
        - Ready
        - In Progress
        - Review
        - Done
  - type: input
    id: story_points
    attributes:
      label: Story Points
      description: Estimated size for backlog refinement.
      placeholder: 3
  - type: input
    id: mvp_version
    attributes:
      label: MVP version
      description: Use labels like mvp-v1, mvp-v2 when applicable.
      placeholder: mvp-v1
  - type: textarea
    id: acceptance_criteria
    attributes:
      label: Acceptance Criteria
      description: Add at least three acceptance criteria for MVP v1 stories.
