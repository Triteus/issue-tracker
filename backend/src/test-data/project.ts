import mongoose from 'mongoose';

export function projectData() {
    return {
        name: 'sample project',
        description: 'Description of a project',
        assignedUsers: [],
        projectLeader: mongoose.Types.ObjectId(),
        filenames: ['file 1', 'file 2']
    }
}

export function updatedProjectData() {
    return {
        ...projectData(),
        assignedUsers: [mongoose.Types.ObjectId()],
        name: 'updated project',
        description: 'updated description'
    }
}