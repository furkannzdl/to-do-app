import prisma from '../prisma.ts';

// Priority'ye göre sayısal değer döner
const getPriorityLevel = (priority: string): number => {
    switch (priority) {
      case 'High':
        return 3;
      case 'Medium':
        return 2;
      case 'Low':
        return 1;
      default:
        return 0;
    }
  };
  

export const getPaginatedTodos = async (page: number, limit: number, search: string = '', status: string = '') => {
    const skip = (page - 1) * limit; // Calculate how many items to skip
  
    try {
      // Fetch paginated todos with search and filtering options
      const todos = await prisma.todo.findMany({
        skip,
        take: limit,
        where: {
          AND: [
            {
              title: {
                contains: search,  // Search in title
                mode: 'insensitive', // Case-insensitive search
              },
            },
            {
              description: {
                contains: search,  // Search in description
                mode: 'insensitive', // Case-insensitive search
              },
            },
            status ? { status: status } : {}  // Filter by status if provided
          ],
        },
      });
  
      // Get total count of todos to calculate the total pages
      const totalTodos = await prisma.todo.count({
        where: {
          AND: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            status ? { status: status } : {}
          ],
        },
      });
  
      const totalPages = Math.ceil(totalTodos / limit);
  
      return { todos, totalPages, totalTodos };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch todos');
    }
  };

  export const createTodo = async (
    title: string,
    description: string,
    status: string,
    priority: string,
    dueDate: string | null
  ) => {
    try {
      const todo = await prisma.todo.create({
        data: {
          title,
          description,
          status: status || 'Pending',
          priority,
          priorityLevel: getPriorityLevel(priority), // 👈 burada ayarlıyoruz
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });
  
      return todo;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create todo');
    }
  };
  

export const deleteTodo = async (id: number) => {
  try {
    await prisma.todo.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete todo');
  }
};

export const updateTodo = async (
    id: number,
    title: string,
    description: string,
    status: string,
    priority: string,
    dueDate: string | null
  ) => {
    try {
      const updated = await prisma.todo.update({
        where: { id },
        data: {
          title,
          description,
          status,
          priority,
          priorityLevel: getPriorityLevel(priority), // 👈 burada da güncelliyoruz
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });
  
      return updated;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update todo');
    }
  };
  

// Add support for search, filter, and pagination
export const getTodosBySearchAndFilter = async (
    page: number,
    limit: number,
    search: string,
    status: string,
    priority: string,
    sortBy: string,
    sortOrder: string
  ) => {
    const skip = (page - 1) * limit;
  
    const whereConditions: any = {};
  
    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
  
    if (status) {
      whereConditions.status = status;
    }
  
    if (priority) {
      whereConditions.priority = priority;
    }
  
    let orderBy = {};
  
    if (sortBy === 'priority') {
        orderBy = {
          priorityLevel: sortOrder === 'desc' ? 'desc' : 'asc',
        };
      } else {
        orderBy = {
          [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
        };
      }
      
  
    try {
      const todos = await prisma.todo.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
      });
  
      const totalTodos = await prisma.todo.count({ where: whereConditions });
      const totalPages = Math.ceil(totalTodos / limit);
  
      return { todos, totalPages, totalTodos };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch todos');
    }
  };
  