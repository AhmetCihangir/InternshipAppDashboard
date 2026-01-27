"""
Productivity/Efficiency Widget - Flask Backend
================================================
A clean, modular Flask API that calculates user efficiency 
based on tasks and returns visual charts as base64 images.
"""

import io
import base64
from flask import Flask, jsonify
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for server rendering
import matplotlib.pyplot as plt
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


def get_mock_tasks():
    """
    Generate mock task data for testing.
    Returns a list of task dictionaries with varied difficulty and completion status.
    
    Schema: {'id': int, 'title': str, 'difficulty': int (1-5), 'is_completed': bool, 'status': str, 'assignee': str, 'created_at': str, 'completed_at': str or None}
    """
    from datetime import datetime, timedelta
    import random
    
    base_date = datetime(2024, 1, 1)
    
    tasks = [
        # High difficulty completed tasks (good for efficiency)
        {"id": 1, "title": "Implement API Authentication", "difficulty": 5, "is_completed": True, "status": "done", "assignee": "Alice", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 2, "title": "Database Schema Design", "difficulty": 4, "is_completed": True, "status": "done", "assignee": "Bob", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 3, "title": "Setup CI/CD Pipeline", "difficulty": 5, "is_completed": True, "status": "done", "assignee": "Charlie", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        
        # Medium difficulty mixed
        {"id": 4, "title": "Write Unit Tests", "difficulty": 3, "is_completed": True, "status": "done", "assignee": "Diana", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 5, "title": "Code Review Session", "difficulty": 2, "is_completed": True, "status": "done", "assignee": "Alice", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 6, "title": "API Documentation", "difficulty": 3, "is_completed": False, "status": "doing", "assignee": "Bob", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": None},
        {"id": 7, "title": "Bug Fix: Login Issue", "difficulty": 3, "is_completed": True, "status": "done", "assignee": "Charlie", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        
        # Low difficulty tasks
        {"id": 8, "title": "Update README", "difficulty": 1, "is_completed": True, "status": "done", "assignee": "Diana", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 9, "title": "Team Meeting Notes", "difficulty": 1, "is_completed": True, "status": "done", "assignee": "Alice", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 10, "title": "Email Status Report", "difficulty": 1, "is_completed": False, "status": "todo", "assignee": "Bob", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": None},
        
        # Incomplete high difficulty (impacts efficiency negatively)
        {"id": 11, "title": "Microservices Migration", "difficulty": 5, "is_completed": False, "status": "doing", "assignee": "Charlie", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": None},
        {"id": 12, "title": "Performance Optimization", "difficulty": 4, "is_completed": False, "status": "todo", "assignee": "Diana", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": None},
        
        # Additional varied tasks
        {"id": 13, "title": "Frontend Integration", "difficulty": 4, "is_completed": True, "status": "done", "assignee": "Alice", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 14, "title": "Security Audit Prep", "difficulty": 4, "is_completed": True, "status": "done", "assignee": "Bob", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": (base_date + timedelta(days=random.randint(31,60))).strftime('%Y-%m-%d')},
        {"id": 15, "title": "Onboarding Docs", "difficulty": 2, "is_completed": False, "status": "todo", "assignee": "Charlie", "created_at": (base_date + timedelta(days=random.randint(0,30))).strftime('%Y-%m-%d'), "completed_at": None},
    ]
    
    return tasks


def get_mock_weekly_efficiency():
    """
    Generate mock weekly efficiency data.
    Returns efficiency scores for each day of the week (Mon-Sun).
    
    In a real app, this would query historical task completion data.
    """
    return {
        "Monday": 72.5,
        "Tuesday": 65.3,
        "Wednesday": 78.9,
        "Thursday": 81.2,
        "Friday": 68.1,  # Today's calculated efficiency
        "Saturday": None,  # Future days are None
        "Sunday": None
    }

def calculate_weighted_efficiency(tasks):
    """
    Calculate weighted efficiency based on task difficulty.
    
    Formula: (Sum of Difficulty of COMPLETED Tasks / Sum of Difficulty of ALL Tasks) * 100
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        float: Efficiency percentage (0-100), rounded to 1 decimal place
    """
    if not tasks:
        return 0.0
    
    total_difficulty = sum(task["difficulty"] for task in tasks)
    completed_difficulty = sum(
        task["difficulty"] for task in tasks if task["is_completed"]
    )
    
    # Handle edge case: avoid division by zero
    if total_difficulty == 0:
        return 0.0
    
    efficiency = (completed_difficulty / total_difficulty) * 100
    return round(efficiency, 1)


def _create_base64_image(fig):

    buffer = io.BytesIO()
    fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight', 
                facecolor='#1a1a2e', edgecolor='none')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    plt.close(fig)
    return image_base64


def generate_difficulty_pie_chart(tasks):
    # Count tasks by difficulty level
    difficulty_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for task in tasks:
        difficulty_counts[task["difficulty"]] += 1
    
    # Filter out zero counts
    labels = []
    sizes = []
    colors = ['#00d4aa', '#00b4d8', '#4895ef', '#7b68ee', '#e040fb']
    filtered_colors = []
    
    difficulty_names = {
        1: 'Very Easy (1)',
        2: 'Easy (2)', 
        3: 'Medium (3)',
        4: 'Hard (4)',
        5: 'Very Hard (5)'
    }
    
    for diff, count in difficulty_counts.items():
        if count > 0:
            labels.append(difficulty_names[diff])
            sizes.append(count)
            filtered_colors.append(colors[diff - 1])
    
    # Create pie chart
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        autopct='%1.1f%%',
        colors=filtered_colors,
        explode=[0.02] * len(sizes),
        shadow=True,
        startangle=90
    )
    
    # Style the text
    for text in texts:
        text.set_color('#caf0f8')
        text.set_fontsize(9)
    for autotext in autotexts:
        autotext.set_color('#1a1a2e')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(9)
    
    ax.set_title('Task Difficulty Distribution', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    
    return _create_base64_image(fig)


def generate_efficiency_gauge_chart(efficiency_score):
    """
    Generate a gauge/bar chart showing efficiency percentage.
    
    Args:
        efficiency_score: Float between 0 and 100
        
    Returns:
        str: Base64 encoded PNG image string
    """
    fig, ax = plt.subplots(figsize=(6, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Create horizontal bar gauge
    bar_width = 0.5
    
    # Background bar (represents 100%)
    ax.barh(0, 100, height=bar_width, color='#2d2d44', edgecolor='none')
    
    # Efficiency bar with gradient color based on score
    if efficiency_score >= 75:
        bar_color = '#00d4aa'  # Green - Excellent
    elif efficiency_score >= 50:
        bar_color = '#ffd60a'  # Yellow - Good
    elif efficiency_score >= 25:
        bar_color = '#ff9500'  # Orange - Fair
    else:
        bar_color = '#ff3b30'  # Red - Needs Improvement
    
    ax.barh(0, efficiency_score, height=bar_width, color=bar_color, edgecolor='none')
    
    # Add efficiency percentage text
    ax.text(50, 0, f'{efficiency_score}%', 
            ha='center', va='center', 
            fontsize=24, fontweight='bold', 
            color='#ffffff')
    
    # Add status text below
    if efficiency_score >= 75:
        status = "Excellent Performance! 🚀"
    elif efficiency_score >= 50:
        status = "Good Progress 👍"
    elif efficiency_score >= 25:
        status = "Room for Improvement 📈"
    else:
        status = "Needs Attention ⚠️"
    
    ax.text(50, -0.7, status, 
            ha='center', va='center', 
            fontsize=12, 
            color='#caf0f8')
    
    # Style the axes
    ax.set_xlim(0, 100)
    ax.set_ylim(-1.2, 0.8)
    ax.axis('off')
    
    ax.set_title('Weighted Efficiency Score', color='#caf0f8', fontsize=14, fontweight='bold', pad=20)
    
    # Add scale markers
    for x in [0, 25, 50, 75, 100]:
        ax.text(x, 0.45, str(x), ha='center', va='bottom', fontsize=8, color='#8892b0')
    
    return _create_base64_image(fig)


def generate_weekly_trend_chart(weekly_data):
    """
    Generate a line chart showing efficiency trend across the week.
    
    Args:
        weekly_data: Dict with day names as keys and efficiency scores as values
        
    Returns:
        str: Base64 encoded PNG image string
    """
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_abbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Separate completed days from future days
    completed_days = []
    completed_scores = []
    future_days = []
    
    for i, day in enumerate(days):
        score = weekly_data.get(day)
        if score is not None:
            completed_days.append(i)
            completed_scores.append(score)
        else:
            future_days.append(i)
    
    fig, ax = plt.subplots(figsize=(8, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Plot the efficiency line
    if completed_scores:
        ax.plot(completed_days, completed_scores, 
                color='#00d4aa', linewidth=2.5, marker='o', 
                markersize=8, markerfacecolor='#00d4aa', markeredgecolor='#ffffff',
                markeredgewidth=2, label='Efficiency %', zorder=5)
        
        # Fill area under the curve
        ax.fill_between(completed_days, completed_scores, alpha=0.2, color='#00d4aa')
        
        # Add value labels on points
        for x, y in zip(completed_days, completed_scores):
            ax.annotate(f'{y}%', (x, y), textcoords="offset points", 
                        xytext=(0, 12), ha='center', fontsize=9, 
                        color='#ffffff', fontweight='bold')
    
    # Style the grid
    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(0, 110)
    ax.set_xticks(range(7))
    ax.set_xticklabels(day_abbrev, color='#caf0f8', fontsize=10)
    ax.set_ylabel('Efficiency %', color='#caf0f8', fontsize=11)
    
    # Add horizontal reference lines
    for y in [25, 50, 75, 100]:
        ax.axhline(y=y, color='#2d2d44', linestyle='--', linewidth=0.8, alpha=0.7)
    
    # Add "Today" marker
    if completed_days:
        today_idx = completed_days[-1]
        ax.axvline(x=today_idx, color='#4895ef', linestyle=':', linewidth=1.5, alpha=0.8)
        ax.text(today_idx, 105, 'Today', ha='center', va='bottom', 
                fontsize=9, color='#4895ef', fontweight='bold')
    
    # Gray out future days
    for idx in future_days:
        ax.axvspan(idx - 0.4, idx + 0.4, alpha=0.15, color='#8892b0')
    
    # Style axes
    ax.tick_params(axis='y', colors='#8892b0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    ax.set_title('Weekly Efficiency Trend', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    
    plt.tight_layout()
    return _create_base64_image(fig)


def generate_incomplete_tasks_by_section_bar_chart(tasks):
    """
    Generate a bar chart showing total incomplete tasks by section (To Do, Doing).
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        str: Base64 encoded PNG image string
    """
    incomplete_tasks = [task for task in tasks if not task["is_completed"]]
    section_counts = {"To Do": 0, "Doing": 0}
    for task in incomplete_tasks:
        if task["status"] == "todo":
            section_counts["To Do"] += 1
        elif task["status"] == "doing":
            section_counts["Doing"] += 1
    
    fig, ax = plt.subplots(figsize=(6, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    bars = ax.bar(section_counts.keys(), section_counts.values(), color=['#ff9500', '#ffd60a'], edgecolor='none', width=0.6)
    
    ax.set_title('Incomplete Tasks by Section', color='#caf0f8', fontsize=14, fontweight='bold', pad=20)
    ax.set_ylabel('Number of Tasks', color='#caf0f8', fontsize=11)
    ax.tick_params(axis='x', colors='#caf0f8')
    ax.tick_params(axis='y', colors='#8892b0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.1, f'{int(height)}', ha='center', va='bottom', color='#ffffff', fontweight='bold')
    
    return _create_base64_image(fig)


def generate_completion_status_pie_chart(tasks):
    """
    Generate a pie chart showing total tasks by completion status (Incomplete, Complete).
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        str: Base64 encoded PNG image string
    """
    complete_count = sum(1 for task in tasks if task["is_completed"])
    incomplete_count = len(tasks) - complete_count
    
    labels = ['Complete', 'Incomplete']
    sizes = [complete_count, incomplete_count]
    colors = ['#00d4aa', '#ff3b30']
    
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        autopct='%1.1f%%',
        colors=colors,
        explode=[0.02, 0.02],
        shadow=True,
        startangle=90
    )
    
    # Style the text
    for text in texts:
        text.set_color('#caf0f8')
        text.set_fontsize(12)
    for autotext in autotexts:
        autotext.set_color('#1a1a2e')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(10)
    
    ax.set_title('Tasks by Completion Status', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    
    return _create_base64_image(fig)


def generate_upcoming_tasks_by_user_bar_chart(tasks):
    """
    Generate a bar chart for total upcoming (incomplete) tasks for each responsible user.
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        str: Base64 encoded PNG image string
    """
    from collections import defaultdict
    upcoming_tasks = [task for task in tasks if not task["is_completed"]]
    user_counts = defaultdict(int)
    for task in upcoming_tasks:
        user_counts[task["assignee"]] += 1
    
    users = list(user_counts.keys())
    counts = list(user_counts.values())
    
    fig, ax = plt.subplots(figsize=(8, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    bars = ax.bar(users, counts, color='#4895ef', edgecolor='none', width=0.6)
    
    ax.set_title('Upcoming Tasks by User', color='#caf0f8', fontsize=14, fontweight='bold', pad=20)
    ax.set_ylabel('Number of Tasks', color='#caf0f8', fontsize=11)
    ax.tick_params(axis='x', colors='#caf0f8')
    ax.tick_params(axis='y', colors='#8892b0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.1, f'{int(height)}', ha='center', va='bottom', color='#ffffff', fontweight='bold')
    
    return _create_base64_image(fig)


def generate_task_completion_over_time_line_chart(tasks):
    """
    Generate a line chart for task completion over time (cumulative).
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        str: Base64 encoded PNG image string
    """
    from collections import defaultdict
    completed_tasks = [task for task in tasks if task["completed_at"]]
    completed_tasks.sort(key=lambda x: x["completed_at"])
    
    date_counts = defaultdict(int)
    for task in completed_tasks:
        date_counts[task["completed_at"]] += 1
    
    dates = sorted(date_counts.keys())
    cumulative = []
    total = 0
    for date in dates:
        total += date_counts[date]
        cumulative.append(total)
    
    fig, ax = plt.subplots(figsize=(8, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    ax.plot(dates, cumulative, color='#00d4aa', linewidth=2.5, marker='o', markersize=6, markerfacecolor='#00d4aa', markeredgecolor='#ffffff', markeredgewidth=2)
    
    ax.set_title('Task Completion Over Time', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Date', color='#caf0f8', fontsize=11)
    ax.set_ylabel('Cumulative Completed Tasks', color='#caf0f8', fontsize=11)
    ax.tick_params(axis='x', colors='#8892b0', rotation=45)
    ax.tick_params(axis='y', colors='#8892b0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    plt.tight_layout()
    return _create_base64_image(fig)


def generate_person_efficiency_chart(tasks, person_name):
    """
    Generate an efficiency gauge chart for a specific person.
    
    Args:
        tasks: List of task dictionaries
        person_name: Name of the person to generate chart for
        
    Returns:
        str: Base64 encoded PNG image string
    """
    # Filter tasks for this person
    person_tasks = [task for task in tasks if task["assignee"] == person_name]
    
    if not person_tasks:
        return None
    
    # Calculate efficiency for this person
    total_difficulty = sum(task["difficulty"] for task in person_tasks)
    completed_difficulty = sum(task["difficulty"] for task in person_tasks if task["is_completed"])
    
    if total_difficulty == 0:
        efficiency_score = 0.0
    else:
        efficiency_score = round((completed_difficulty / total_difficulty) * 100, 1)
    
    total_tasks = len(person_tasks)
    completed_tasks = sum(1 for task in person_tasks if task["is_completed"])
    
    # Create the chart
    fig, ax = plt.subplots(figsize=(5, 3.5))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Create horizontal bar gauge
    bar_width = 0.4
    
    # Background bar (represents 100%)
    ax.barh(0, 100, height=bar_width, color='#2d2d44', edgecolor='none')
    
    # Efficiency bar with color based on score
    if efficiency_score >= 75:
        bar_color = '#00d4aa'  # Green
    elif efficiency_score >= 50:
        bar_color = '#ffd60a'  # Yellow
    elif efficiency_score >= 25:
        bar_color = '#ff9500'  # Orange
    else:
        bar_color = '#ff3b30'  # Red
    
    ax.barh(0, efficiency_score, height=bar_width, color=bar_color, edgecolor='none')
    
    # Add efficiency percentage text
    ax.text(50, 0, f'{efficiency_score}%', 
            ha='center', va='center', 
            fontsize=20, fontweight='bold', 
            color='#ffffff')
    
    # Add task count below
    ax.text(50, -0.55, f'{completed_tasks}/{total_tasks} tasks completed', 
            ha='center', va='center', 
            fontsize=10, 
            color='#8892b0')
    
    # Style the axes
    ax.set_xlim(0, 100)
    ax.set_ylim(-0.9, 0.6)
    ax.axis('off')
    
    ax.set_title(f'{person_name}', color='#caf0f8', fontsize=14, fontweight='bold', pad=10)
    
    return _create_base64_image(fig)


def generate_all_person_charts(tasks):
    """
    Generate efficiency charts for all team members.
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        dict: Contains base64 strings for each person's chart
    """
    # Get unique assignees
    assignees = list(set(task["assignee"] for task in tasks))
    assignees.sort()  # Sort alphabetically
    
    person_charts = {}
    for person in assignees:
        chart = generate_person_efficiency_chart(tasks, person)
        if chart:
            person_charts[person] = chart
    
    return person_charts


def generate_person_weekly_trend_chart(person_name):
    """
    Generate a weekly efficiency trend chart for a specific person.
    
    Args:
        person_name: Name of the person
        
    Returns:
        str: Base64 encoded PNG image string
    """
    import random
    
    # Generate mock weekly data for this person
    # In real app, this would be calculated from historical task data
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_abbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Generate different patterns for each person
    base_efficiency = {
        "Alice": 85,
        "Bob": 65,
        "Charlie": 55,
        "Diana": 50
    }.get(person_name, 60)
    
    # Create weekly data with some variation
    weekly_scores = []
    for i in range(5):  # Mon-Fri
        variation = random.uniform(-15, 15)
        score = min(100, max(0, base_efficiency + variation))
        weekly_scores.append(round(score, 1))
    
    # Weekend is None (future/no work)
    completed_days = list(range(5))
    future_days = [5, 6]
    
    fig, ax = plt.subplots(figsize=(6, 3))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Plot the efficiency line
    ax.plot(completed_days, weekly_scores, 
            color='#00d4aa', linewidth=2, marker='o', 
            markersize=6, markerfacecolor='#00d4aa', markeredgecolor='#ffffff',
            markeredgewidth=1.5, zorder=5)
    
    # Fill area under the curve
    ax.fill_between(completed_days, weekly_scores, alpha=0.2, color='#00d4aa')
    
    # Add value labels on points
    for x, y in zip(completed_days, weekly_scores):
        ax.annotate(f'{y}%', (x, y), textcoords="offset points", 
                    xytext=(0, 10), ha='center', fontsize=8, 
                    color='#ffffff', fontweight='bold')
    
    # Style the axes
    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(0, 110)
    ax.set_xticks(range(7))
    ax.set_xticklabels(day_abbrev, color='#caf0f8', fontsize=8)
    
    # Add horizontal reference lines
    for y in [50, 100]:
        ax.axhline(y=y, color='#2d2d44', linestyle='--', linewidth=0.5, alpha=0.5)
    
    # Gray out future days
    for idx in future_days:
        ax.axvspan(idx - 0.4, idx + 0.4, alpha=0.15, color='#8892b0')
    
    # Style axes
    ax.tick_params(axis='y', colors='#8892b0', labelsize=8)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    ax.set_title(f'{person_name} - Weekly Trend', color='#caf0f8', fontsize=11, fontweight='bold', pad=8)
    
    plt.tight_layout()
    return _create_base64_image(fig)


def generate_all_person_weekly_trends(tasks):
    """
    Generate weekly trend charts for all team members.
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        dict: Contains base64 strings for each person's weekly trend chart
    """
    assignees = list(set(task["assignee"] for task in tasks))
    assignees.sort()
    
    person_trends = {}
    for person in assignees:
        chart = generate_person_weekly_trend_chart(person)
        if chart:
            person_trends[person] = chart
    
    return person_trends


def generate_charts(tasks, efficiency_score, weekly_data):
    """
    Generate all charts for the productivity widget.
    
    Args:
        tasks: List of task dictionaries
        efficiency_score: Calculated efficiency percentage
        weekly_data: Weekly efficiency history
        
    Returns:
        dict: Contains base64 strings for all charts
    """
    return {
        "difficulty_pie_base64": generate_difficulty_pie_chart(tasks),
        "upcoming_by_user_bar_base64": generate_upcoming_tasks_by_user_bar_chart(tasks),
        "person_charts": generate_all_person_charts(tasks),
        "person_weekly_trends": generate_all_person_weekly_trends(tasks)
    }




# API ROUTES

@app.route('/api/productivity-stats', methods=['GET'])
def get_productivity_stats():
    """
    API endpoint that returns productivity statistics and charts.
    
    Returns JSON with:
    - efficiency_score: Weighted efficiency percentage
    - total_tasks: Total number of tasks
    - completed_tasks: Number of completed tasks
    - charts: Base64 encoded chart images
    """
    try:
        # Get mock data
        tasks = get_mock_tasks()
        weekly_data = get_mock_weekly_efficiency()
        
        # Calculate statistics
        efficiency_score = calculate_weighted_efficiency(tasks)
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task["is_completed"])
        
        # Generate charts (including weekly trend)
        charts = generate_charts(tasks, efficiency_score, weekly_data)
        
        return jsonify({
            "status": "success",
            "data": {
                "efficiency_score": efficiency_score,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "weekly_efficiency": weekly_data,
                "charts": charts
            }
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "productivity-widget-api"})


# MAIN
if __name__ == '__main__':
    print("Starting Productivity Widget API...")
    print("Endpoints:")
    print("   - GET /api/productivity-stats")
    print("   - GET /api/health")
    print("")
    app.run(debug=True, host='0.0.0.0', port=5001)
