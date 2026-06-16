name: Course Task
about: Create a course-related task or administrative issue.

title: "Course Task: Short description"
labels: ["Course Task"]

body:
  - type: markdown
    attributes:
      value: |-
        ## Course Task
  - type: input
    id: task_description
    attributes:
      label: Task description
      description: What needs to be done for the course requirements?
  - type: textarea
    id: success_criteria
    attributes:
      label: Success criteria
      description: How will you know the task is complete?
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options:
        - High
        - Medium
        - Low
