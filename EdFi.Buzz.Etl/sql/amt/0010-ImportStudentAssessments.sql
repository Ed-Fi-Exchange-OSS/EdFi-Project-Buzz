-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT
    studentschooldim.studentschoolkey,
    assessment.assessmenttitle,
    assessment.assessmentidentifier,
    studentassessment.administrationdate as datetaken,
    studentassessmentscoreresult.result as score
FROM
    edfi.assessment
    INNER JOIN 
        edfi.studentassessment
            ON assessment.assessmentidentifier = studentassessment.assessmentidentifier
    INNER JOIN
        edfi.student
            ON studentassessment.studentusi = student.studentusi
    INNER JOIN
        analytics.studentschooldim
            ON student.studentuniqueid = studentschooldim.studentkey
    INNER JOIN
        edfi.studentassessmentscoreresult
            ON studentassessment.assessmentidentifier = studentassessmentscoreresult.assessmentidentifier
                AND studentassessment.studentassessmentidentifier = studentassessmentscoreresult.studentassessmentidentifier
    INNER JOIN
        edfi.assessmentcategorydescriptor
            ON Assessment.assessmentcategorydescriptorid = assessmentcategorydescriptor.assessmentcategorydescriptorid
    INNER JOIN
        edfi.Descriptor
            ON assessmentcategorydescriptor.assessmentcategorydescriptorid = descriptor.descriptorid
WHERE
    (descriptor.namespace = 'uri://ed-fi.org/AssessmentCategoryDescriptor' 
        OR descriptor.namespace = 'http://www.ed-fi.org/Descriptor/AssessmentCategoryDescriptor.xml'
    )
    AND descriptor.codevalue 
        in ('Formative','State assessment','State high school course assessment','State high school subject assessment');
    