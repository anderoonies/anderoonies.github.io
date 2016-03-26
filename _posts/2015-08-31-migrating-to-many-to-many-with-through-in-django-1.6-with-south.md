---
layout: post
title:  Migrating to Many To Many with Through in Django 1.6 with South
---

This post was originally published on the [CodeHS Engineering Blog](https://medium.com/codehs-engineering-blog).

## Migrating to Many To Many with Through in Django 1.6 with South

[Through fields](https://docs.djangoproject.com/en/1.8/ref/models/fields/#django.db.models.ManyToManyField.through_fields) in Django are extremely powerful, and allow you to add fields to the join between two tables in a Many To Many relationship.

The problem I found—and had a hard time solving—was what to do when you have an existing Many To Many and need to add a through field.

Hopefully, this will save anyone who was in my position and couldn’t find answers.

## Background

I spent the Summer working with [CodeHS](codehs.com), a super computer science education website.

In our schema defined in Django, we had Course and Student models, related with a Many To Many. Any time we needed a student’s progress in a course it was calculated.

We wanted teachers and school administrators to be able to view this course progress in a [Looker](www.looker.com) dashboard. The problem was that, when connecting to Looker, the course progress value needed to be stored in our read replica.

I needed to add fields to a default Django Many To Many join table, something the through field allows you to do.

## The Through Field

A through field represents the join between two models connected in a Many To Many. Django’s documentation gives The Beatles as an example — a ‘Membership’ is the join between a band member and the band. In my case, a ‘CourseMembership’ would model the join between a student and a course.

The model looks like this:

{% gist anderoonies/097b03a3ab0d97e1f33f %}

A course membership has exactly one course and one user. Also added is the course_progress field, the reason for the migration.

The through field is added to the Many To Many in the Course model here:

{% gist anderoonies/bb76c786640ac262a395 %}

## Through Field Queries

Something the Django documentation points out well is that queries for a Many To Many do not work for a Many To Many with a through field.

Calls have to be modified as such:

{% gist anderoonies/89386af17a8c6565275f %}

Which made the next step searching for any occurrence of the former calls and replacing them with the latter.

## The Problem

What stumped me was how to migrate to the new through field.

A lot of resources recommend using bulk_create with Django’s ORM to convert to the through field.

That strategy would look something like this:

{% gist anderoonies/b6c790063699a6132416 %}

Essentially, a mock join class would be created, then all of the joins in the Many To Many unpacked in a list comprehension, then CourseMembership objects would be created with a bulk_create.

The problem with this is that it is very slow. There were over 600,000 joins in the database between students and courses, meaning this migration would have taken over 15 minutes (as long as I let it run before killing it), long enough to create a problem in deploy.

The first solution I thought of was to run the script locally, creating the new join. Then I would deploy that new table to our production database, push all the code that interfaces with CourseMemberships, and patch any new joins that were created in the interim.

This solution was sloppy, though, and I wanted something cleaner.

## The Solution
SQL common table expressions run far faster than operations with the Django ORM.

If I could run a CTE during that would copy over all of the joins to the new table created with the through field, the code that interfaced with the new table could be deployed at the same time as the database migration.

The CTE looks something like this:

{% gist anderoonies/2d549777b6372618655a %}

Instead of calculating the course progress during the migration (and wasting more time), 0 was inserted as course progress.

CTEs can be performed inside the Django migration with db.execute. So this SQL query looks like this when run inside the migration:

{% gist anderoonies/f96dc0991ac2b06f10a1 %}

This code needs to be put into the forward migration after the new table is created but before the previous join table is deleted.

The opposite is done in the backwards migration, in case something breaks and needs to be rolled back.

{% gist anderoonies/f8b0a7a00e80696ff8b2 %}

The migration runs in about 4 seconds. The only thing to do then is to calculate the course progress, which in my case is done on demand.
