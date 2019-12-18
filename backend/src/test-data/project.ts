import mongoose from 'mongoose';

export function projectData() {
    return {
        name: 'sample project',
        description: 'Description of a project',
        assigendUsers: [],
        projectLeader: mongoose.Types.ObjectId(),
        filenames: ['file 1', 'file 2']
    }
}

export function updatedProjectData() {
    return {
        ...projectData(),
        name: 'updated project',
        description: 'updated description'
    }
}